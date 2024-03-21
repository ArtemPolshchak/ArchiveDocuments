package archive.main.dto.userdto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Request for registration")
public record SignUpRequestDto(
        @Schema(description = "Username", example = "Jonny")
        @NotBlank(message = "Username cannot be empty")
        @Size(min = 2, max = 50, message = "The user name must contain between 5 and 50 characters")
        String username,

        @Schema(description = "E-mail address", example = "jondoe@gmail.com")
        @Size(min = 5, max = 255, message = "The e-mail address must contain from 5 to 255 characters")
        @Email(message = "The email address must be in the format user@example.com")
        String email,

        @Schema(description = "Password", example = "my_1secret1_password")
        @Size(max = 255, message = "The length of the password should not be more than 255 characters")
        String password
) {

}