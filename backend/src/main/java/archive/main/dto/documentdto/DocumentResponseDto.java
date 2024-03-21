package archive.main.dto.documentdto;

public record DocumentResponseDto(
        Long id,
        String title,
        String textContent,
        String category,
        String dateCreated
) {
}
