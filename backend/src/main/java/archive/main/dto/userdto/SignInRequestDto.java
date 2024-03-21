package archive.main.dto.userdto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Authentication request")
public record SignInRequestDto(
        @Schema(description = "User mail", example = "admin@gmail.com")
        @NotBlank(message = "The user's mail cannot be empty")
        @Size(min = 5, max = 50, message = "The user's email must contain between 5 and 50 characters")
        String email,
        @Schema(description = "Password", example = "password")
        @NotBlank(message = "The password cannot be empty")
        @Size(min = 8, max = 255, message = "The length of the password should be from 8 to 255 characters")
        String password
) {

}
