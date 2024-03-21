package archive.main.mapper;

import archive.main.dto.categorydto.CategoryDto;
import archive.main.config.MapperConfig;
import archive.main.entity.CategoryEntity;
import org.mapstruct.Mapper;

@Mapper(config = MapperConfig.class)
public interface CategoryMapper {

    CategoryEntity toEntity(CategoryDto categoryDto);

}
