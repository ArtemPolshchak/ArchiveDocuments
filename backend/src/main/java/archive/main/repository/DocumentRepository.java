package archive.main.repository;

import archive.main.entity.DocumentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface DocumentRepository extends JpaRepository<DocumentEntity, Long>, JpaSpecificationExecutor<DocumentEntity> {

    Optional<DocumentEntity> findByIdAndDeletedFalse(Long id);

    Page<DocumentEntity> findByCategoryName(String categoryName, Pageable pageable);

    Optional<DocumentEntity> findByTitleAndCategoryId(String name, long id);

}
