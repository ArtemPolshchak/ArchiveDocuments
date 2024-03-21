package archive.main.dto.userdto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Answer ")
public record JwtAuthenticationResponseDto(
        @Schema(description = "Access token", example = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTYyMjUwNj...")
        String token
) {

}
