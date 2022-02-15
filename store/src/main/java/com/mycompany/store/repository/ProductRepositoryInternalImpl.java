package com.mycompany.store.repository;

import static org.springframework.data.relational.core.query.Criteria.where;

import com.mycompany.store.domain.Product;
import com.mycompany.store.domain.enumeration.Size;
import com.mycompany.store.repository.rowmapper.ProductCategoryRowMapper;
import com.mycompany.store.repository.rowmapper.ProductRowMapper;
import io.r2dbc.spi.Row;
import io.r2dbc.spi.RowMetadata;
import java.math.BigDecimal;
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
 * Spring Data SQL reactive custom repository implementation for the Product entity.
 */
@SuppressWarnings("unused")
class ProductRepositoryInternalImpl extends SimpleR2dbcRepository<Product, Long> implements ProductRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final ProductCategoryRowMapper productcategoryMapper;
    private final ProductRowMapper productMapper;

    private static final Table entityTable = Table.aliased("product", EntityManager.ENTITY_ALIAS);
    private static final Table productCategoryTable = Table.aliased("product_category", "productCategory");

    public ProductRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        ProductCategoryRowMapper productcategoryMapper,
        ProductRowMapper productMapper,
        R2dbcEntityOperations entityOperations,
        R2dbcConverter converter
    ) {
        super(
            new MappingRelationalEntityInformation(converter.getMappingContext().getRequiredPersistentEntity(Product.class)),
            entityOperations,
            converter
        );
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.productcategoryMapper = productcategoryMapper;
        this.productMapper = productMapper;
    }

    @Override
    public Flux<Product> findAllBy(Pageable pageable) {
        return findAllBy(pageable, null);
    }

    @Override
    public Flux<Product> findAllBy(Pageable pageable, Criteria criteria) {
        return createQuery(pageable, criteria).all();
    }

    RowsFetchSpec<Product> createQuery(Pageable pageable, Criteria criteria) {
        List<Expression> columns = ProductSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        columns.addAll(ProductCategorySqlHelper.getColumns(productCategoryTable, "productCategory"));
        SelectFromAndJoinCondition selectFrom = Select
            .builder()
            .select(columns)
            .from(entityTable)
            .leftOuterJoin(productCategoryTable)
            .on(Column.create("product_category_id", entityTable))
            .equals(Column.create("id", productCategoryTable));

        String select = entityManager.createSelect(selectFrom, Product.class, pageable, criteria);
        return db.sql(select).map(this::process);
    }

    @Override
    public Flux<Product> findAll() {
        return findAllBy(null, null);
    }

    @Override
    public Mono<Product> findById(Long id) {
        return createQuery(null, where(EntityManager.ENTITY_ALIAS + ".id").is(id)).one();
    }

    private Product process(Row row, RowMetadata metadata) {
        Product entity = productMapper.apply(row, "e");
        entity.setProductCategory(productcategoryMapper.apply(row, "productCategory"));
        return entity;
    }

    @Override
    public <S extends Product> Mono<S> save(S entity) {
        return super.save(entity);
    }
}
