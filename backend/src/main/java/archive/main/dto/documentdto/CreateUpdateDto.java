package archive.main.dto.documentdto;

public record CreateUpdateDto(
        String title,
        String textContent,
        Long categoryId
) {
}
