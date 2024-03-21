package archive.main.mapper;

import archive.main.config.MapperConfig;
import archive.main.dto.userdto.SignUpRequestDto;
import archive.main.entity.UserEntity;
import org.mapstruct.Mapper;

@Mapper(config = MapperConfig.class)
public interface UserMapper {
    UserEntity toEntity(SignUpRequestDto userDto);

}
