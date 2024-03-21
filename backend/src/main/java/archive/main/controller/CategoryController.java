package archive.main.controller;

import archive.main.dto.categorydto.CategoryDto;
import archive.main.entity.CategoryEntity;
import archive.main.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @Operation(summary = "get all categories paginated")
    @GetMapping("/")
    public ResponseEntity<Page<CategoryEntity>> getAllCategories(Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK).body(categoryService.getAllPaginated(pageable));
    }

    @Operation(summary = "get all categories")
    @GetMapping("/get")
    public ResponseEntity<List<CategoryEntity>> getAllCategories() {
        return ResponseEntity.status(HttpStatus.OK).body(categoryService.findAll());
    }

    @Operation(summary = "get all categories")
    @GetMapping("/search")
    public ResponseEntity<Page<CategoryEntity>> getAllByName(@RequestParam String name,  Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK).body(categoryService.findAllByName(name, pageable));
    }

    @Operation(summary = "create new Category")
    @PostMapping
    public ResponseEntity<CategoryEntity> createCategory(@RequestBody CategoryDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.create(dto));
    }

    @Operation(summary = "update category by Id")
    @PutMapping("/update/{id}")
    public ResponseEntity<CategoryEntity> updateCategory(@RequestBody CategoryDto serverDto, @PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.update(id, serverDto));
    }

    @Operation(summary = "delete category by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
