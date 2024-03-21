package archive.main.service;

import archive.main.dto.categorydto.CategoryDto;
import archive.main.mapper.CategoryMapper;
import archive.main.repository.CategoryRepository;
import archive.main.entity.CategoryEntity;
import archive.main.exception.ItemExistsException;
import archive.main.exception.ItemNotFoundException;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.SoftDelete;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public Page<CategoryEntity> getAllPaginated(Pageable pageable) {
        return categoryRepository.findAllByDeletedFalse(pageable);
    }

    public List<CategoryEntity> findAll() {
        return categoryRepository.findAllByDeletedFalseOrderByName();
    }

    public Page<CategoryEntity> findAllByName(String name, Pageable pageable) {
        return categoryRepository.findAllByNameContainingIgnoreCaseAndDeletedFalse(name, pageable);
    }

    public Optional<CategoryEntity> findById(long id) {
        return categoryRepository.findByIdAndDeletedFalse(id);
    }

    public CategoryEntity create(CategoryDto dto) {
        String categoryName = sanitizeCategoryName(dto.name());

        Optional<CategoryEntity> deletedCategoryOptional = findDeletedByName(categoryName);
        if (deletedCategoryOptional.isPresent()) {
            CategoryEntity deletedCategory = deletedCategoryOptional.get();
            deletedCategory.setDeleted(false);
            return categoryRepository.save(deletedCategory);
        }

        validateCategoryNotExist(categoryName);

        CategoryEntity newCategory = categoryMapper.toEntity(dto);
        newCategory.setName(categoryName);
        return categoryRepository.save(newCategory);
    }

    public CategoryEntity update(long id, CategoryDto dto) {
        Long categoryId = id;
        CategoryEntity existingCategory = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ItemNotFoundException("Category not found"));

        String newCategoryName = sanitizeCategoryName(dto.name());

        Optional<CategoryEntity> existingCategoryOptional = categoryRepository.findByName(newCategoryName);
        existingCategoryOptional.ifPresent(category -> {
            if (!category.getId().equals(existingCategory.getId())) {
                throw new ItemExistsException("Category with this name already exists");
            }
        });
        existingCategory.setName(newCategoryName);
        return categoryRepository.save(existingCategory);
    }

    public Optional<CategoryEntity> findDeletedByName(String categoryName) {
        return categoryRepository.findByNameAndDeletedTrue(categoryName);
    }

    @SoftDelete
    public void delete(Long categoryId) {
        CategoryEntity existingCategory = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ItemNotFoundException("Category not found"));
        existingCategory.setDeleted(true);
        categoryRepository.save(existingCategory);
    }

    private String sanitizeCategoryName(String categoryName) {
        return categoryName.trim().toLowerCase();
    }

    private void validateCategoryNotExist(String categoryName) {
        Optional<CategoryEntity> existingCategoryOptional = categoryRepository.findByNameAndDeletedFalse(categoryName);
        if (existingCategoryOptional.isPresent()) {
            throw new ItemExistsException("Category already exists");
        }
    }
}
