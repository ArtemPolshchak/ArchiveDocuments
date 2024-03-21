package archive.main.repository;

import archive.main.entity.CategoryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    Page<CategoryEntity> findAllByDeletedFalse(Pageable pageable);

    List<CategoryEntity> findAllByDeletedFalseOrderByName();

    Page<CategoryEntity> findAllByNameContainingIgnoreCaseAndDeletedFalse(String name, Pageable pageable);

    Optional<CategoryEntity> findByNameAndDeletedFalse(String name);

    Optional<CategoryEntity> findByName(String name);

    Optional<CategoryEntity> findByNameAndDeletedTrue(String name);

    Optional<CategoryEntity> findByIdAndDeletedFalse(Long id);
}
