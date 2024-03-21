package archive.main.service;

import archive.main.dto.documentdto.DocumentCategorySpecDto;
import archive.main.mapper.DocumentMapper;
import archive.main.repository.DocumentRepository;
import archive.main.repository.spec.SpecificationBuilder;
import archive.main.dto.documentdto.CreateUpdateDto;
import archive.main.dto.documentdto.DocumentResponseDto;
import archive.main.entity.CategoryEntity;
import archive.main.entity.DocumentEntity;
import archive.main.exception.ItemExistsException;
import archive.main.exception.ItemNotFoundException;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.SoftDelete;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service

@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final CategoryService categoryService;
    private final DocumentMapper documentMapper;
    private final SpecificationBuilder<DocumentEntity> specificationBuilder;

    public Page<DocumentResponseDto> findAll(Pageable pageable) {
        Specification<DocumentEntity> spec = Specification.where((root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("deleted"), false));
        return documentRepository.findAll(spec, pageable).map(documentMapper::toResponseDto);
    }

    public Page<DocumentResponseDto> findAllByCategoryName(String categoryName, Pageable pageable) {
        return documentRepository.findByCategoryName(categoryName, pageable).map(documentMapper::toResponseDto);
    }

    public Page<DocumentResponseDto> search(DocumentCategorySpecDto specDto, Pageable pageable) {
        Specification<DocumentEntity> spec = specificationBuilder.build(specDto);
        Specification<DocumentEntity> deletedSpec = (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("deleted"), false);
        spec = spec.and(deletedSpec);
        return documentRepository.findAll(spec, pageable).map(documentMapper::toResponseDto);
    }

    public DocumentEntity create(CreateUpdateDto dto) {
        validateExistingDocumentTitle(dto.title(), dto.categoryId());

        DocumentEntity document = documentMapper.toEntity(dto);

        document.setDateCreated(LocalDateTime.now());

        CategoryEntity category = categoryService.findById(dto.categoryId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid category ID"));
        document.setCategory(category);

        return documentRepository.save(document);
    }

    public DocumentEntity findById(long id) {
        return documentRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ItemNotFoundException("Document not found"));
    }

    public DocumentEntity update(long id, CreateUpdateDto dto) {
        DocumentEntity existingDocument = findById(id);
        validateExistingDocumentTitleInCategory(dto.title(), dto.categoryId(), id);

        existingDocument.setTitle(dto.title());
        existingDocument.setTextContent(dto.textContent());

        CategoryEntity category = categoryService.findById(dto.categoryId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid category ID"));
        existingDocument.setCategory(category);

        return documentRepository.save(existingDocument);
    }

    @SoftDelete
    public void delete(Long id) {
        DocumentEntity existingDocument = documentRepository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException("Document not found"));
        existingDocument.setDeleted(true);
        documentRepository.save(existingDocument);
    }

    private void validateExistingDocumentTitle(String title, Long categoryId) {
        Optional<DocumentEntity> existingCategoryOptional = documentRepository.findByTitleAndCategoryId(title, categoryId);
        if (existingCategoryOptional.isPresent()) {
            throw new ItemExistsException("Document with the title in this category already exists, please change title");
        }
    }

    private void validateExistingDocumentTitleInCategory(String title, Long categoryId, Long documentId) {
        Optional<DocumentEntity> existingDocumentOptional = documentRepository.findByTitleAndCategoryId(title, categoryId);
        existingDocumentOptional.ifPresent(existingDocument -> {
            if (!existingDocument.getId().equals(documentId)) {
                throw new ItemExistsException("Document with the title in this category already exists, please change title");
            }
        });
    }
}
