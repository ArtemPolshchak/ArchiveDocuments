package archive.main.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Getter
@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class ItemExistsException extends RuntimeException {
    public ItemExistsException(String message) {
        super(message);
    }
}

