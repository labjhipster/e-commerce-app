package com.mycompany.store.repository;

import static org.springframework.data.relational.core.query.Criteria.where;

import com.mycompany.store.domain.ProductOrder;
import com.mycompany.store.domain.enumeration.OrderStatus;
import com.mycompany.store.repository.rowmapper.CustomerRowMapper;
import com.mycompany.store.repository.rowmapper.ProductOrderRowMapper;
import io.r2dbc.spi.Row;
import io.r2dbc.spi.RowMetadata;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.function.BiFunction;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.convert.R2dbcConverter;
import org.springframework.data.r2dbc.core.R2dbcEntityOperations;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.data.r2dbc.repository.support.SimpleR2dbcRepository;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.relational.core.sql.Column;
import org.springframework.data.relational.core.sql.Expression;
import org.springframework.data.relational.core.sql.Select;
import org.springframework.data.relational.core.sql.SelectBuilder.SelectFromAndJoinCondition;
import org.springframework.data.relational.core.sql.Table;
import org.springframework.data.relational.repository.support.MappingRelationalEntityInformation;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.r2dbc.core.RowsFetchSpec;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data SQL reactive custom repository implementation for the ProductOrder entity.
 */
@SuppressWarnings("unused")
class ProductOrderRepositoryInternalImpl extends SimpleR2dbcRepository<ProductOrder, Long> implements ProductOrderRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final CustomerRowMapper customerMapper;
    private final ProductOrderRowMapper productorderMapper;

    private static final Table entityTable = Table.aliased("product_order", EntityManager.ENTITY_ALIAS);
    private static final Table customerTable = Table.aliased("customer", "customer");

    public ProductOrderRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        CustomerRowMapper customerMapper,
        ProductOrderRowMapper productorderMapper,
        R2dbcEntityOperations entityOperations,
        R2dbcConverter converter
    ) {
        super(
            new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(ProductOrder.class)),
            entityOperations,
            converter
        );
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.customerMapper = customerMapper;
        this.productorderMapper = productorderMapper;
    }

    @Override
    public Flux<ProductOrder> findAllBy(Pageable pageable) {
        return findAllBy(pageable, null);
    }

    @Override
    public Flux<ProductOrder> findAllBy(Pageable pageable, Criteria criteria) {
        return createQuery(pageable, criteria).all();
    }

    RowsFetchSpec<ProductOrder> createQuery(Pageable pageable, Criteria criteria) {
        List<Expression> columns = ProductOrderSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        columns.addAll(CustomerSqlHelper.getColumns(customerTable, "customer"));
        SelectFromAndJoinCondition selectFrom = Select
            .builder()
            .select(columns)
            .from(entityTable)
            .leftOuterJoin(customerTable)
            .on(Column.create("customer_id", entityTable))
            .equals(Column.create("id", customerTable));

        String select = entityManager.createSelect(selectFrom, ProductOrder.class, pageable, criteria);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<ProductOrder> findAll() {
        return findAllBy(null, null);
    }

    @Override
    public Mono<ProductOrder> findById(Long id) {
        return createQuery(null, where(EntityManager.ENTITY_ALIAS + ".id").is(id)).one();
    }

    private ProductOrder process(Row row, RowMetadata metadata) {
        ProductOrder entity = productorderMapper.apply(row, "e");
        entity.setCustomer(customerMapper.apply(row, "customer"));
        return entity;
    }

    @Override
    public <S extends ProductOrder> Mono<S> save(S entity) {
        return super.save(entity);
    }
}
