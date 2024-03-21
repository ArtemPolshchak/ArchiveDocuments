package archive.main.controller;

import archive.main.dto.documentdto.DocumentCategorySpecDto;
import archive.main.dto.documentdto.CreateUpdateDto;
import archive.main.dto.documentdto.DocumentResponseDto;
import archive.main.entity.DocumentEntity;
import archive.main.service.DocumentService;
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

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {
    private final DocumentService documentService;

    @Operation(summary = "get all documents")
    @GetMapping("/")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<DocumentResponseDto>> getAllDocuments(Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK).body(documentService.findAll(pageable));
    }

    @Operation(summary = "get all documents by Category")
    @GetMapping("/category")
    public ResponseEntity<Page<DocumentResponseDto>> getAllByCategoryName(@RequestParam String categoryName, Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK).body(documentService.findAllByCategoryName(categoryName, pageable));
    }

    @Operation(summary = "create new Document")
    @PostMapping
    public ResponseEntity<DocumentEntity> createDocument(@RequestBody CreateUpdateDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(documentService.create(dto));
    }

    @Operation(summary = "Update a document")
    @PutMapping("/update/{id}")
    public ResponseEntity<DocumentEntity> updateDocument(@PathVariable Long id, @RequestBody CreateUpdateDto dto) {

        return ResponseEntity.status(HttpStatus.OK).body(documentService.update(id, dto));
    }

    @Operation(summary = "Delete a document")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @Operation(summary = "search documents")
    @GetMapping("/search")
    public ResponseEntity<Page<DocumentResponseDto>> search(DocumentCategorySpecDto specDto, Pageable page) {
        return ResponseEntity.status(HttpStatus.OK).body(documentService.search(specDto, page));
    }

    @Operation(summary = "get document by Id")
    @GetMapping("/{id}")
    public ResponseEntity<DocumentEntity> getById(@PathVariable Long id) {

        return ResponseEntity.status(HttpStatus.OK).body(documentService.findById(id));
    }
}
