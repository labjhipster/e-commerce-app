package com.mycompany.store.repository;

import com.mycompany.store.domain.ProductCategory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data SQL reactive repository for the ProductCategory entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProductCategoryRepository extends ReactiveCrudRepository<ProductCategory, Long>, ProductCategoryRepositoryInternal {
    @Override
    <S extends ProductCategory> Mono<S> save(S entity);

    @Override
    Flux<ProductCategory> findAll();

    @Override
    Mono<ProductCategory> findById(Long id);

    @Override
    Mono<Void> deleteById(Long id);
}

interface ProductCategoryRepositoryInternal {
    <S extends ProductCategory> Mono<S> save(S entity);

    Flux<ProductCategory> findAllBy(Pageable pageable);

    Flux<ProductCategory> findAll();

    Mono<ProductCategory> findById(Long id);

    Flux<ProductCategory> findAllBy(Pageable pageable, Criteria criteria);
}
