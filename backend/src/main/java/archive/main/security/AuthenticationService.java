package archive.main.security;


import archive.main.dto.userdto.JwtAuthenticationResponseDto;
import archive.main.dto.userdto.SignInRequestDto;
import archive.main.dto.userdto.SignUpRequestDto;
import archive.main.entity.UserEntity;
import archive.main.mapper.UserMapper;
import archive.main.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserService userService;

    private final JwtService jwtService;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final UserMapper userMapper;

    public JwtAuthenticationResponseDto signUp(SignUpRequestDto request) {

        UserEntity user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.password()));
        userService.createUser(user);

        return new JwtAuthenticationResponseDto(jwtService.generateToken(user));
    }

    public JwtAuthenticationResponseDto signIn(SignInRequestDto request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.email(),
                request.password()
        ));

        UserDetails user = userService
                .userDetailsService()
                .loadUserByUsername(request.email());

        return new JwtAuthenticationResponseDto(jwtService.generateToken(user));
    }
}
