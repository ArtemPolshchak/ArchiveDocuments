package archive.main.controller;

import archive.main.entity.UserEntity;
import archive.main.enumeration.Role;
import archive.main.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class UserController {

    private final UserService service;

    @Operation(summary = "get all users")
    @GetMapping("/")
    public ResponseEntity<Iterable<UserEntity>> getAllUsers(Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK).body(service.findAllByPage(pageable));
    }

    @Operation(summary = "get user by Id")
    @GetMapping("/{id}")
    public ResponseEntity<UserEntity> getById(@PathVariable Long id) {

        return ResponseEntity.status(HttpStatus.OK).body(service.getById(id));
    }

    @Operation(summary = "change role for user")
    @PutMapping("/{id}/setRole")
    public ResponseEntity<String> setUserRole(@PathVariable Long id, @RequestParam Role newRole) {
        service.setUserRole(id, newRole);
        return ResponseEntity.status(HttpStatus.OK).body("User role updated");
    }

    @Operation(summary = "delete role and setup it on GUEST")
    @PutMapping("/{id}/removeRole")
    public ResponseEntity<String> removeUserRole(@PathVariable Long id) {
        service.removeUserRole(id);
        return ResponseEntity.status(HttpStatus.OK).body("User role deleted");
    }
}
