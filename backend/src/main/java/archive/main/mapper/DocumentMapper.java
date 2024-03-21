package archive.main.mapper;

import archive.main.config.MapperConfig;
import archive.main.dto.documentdto.CreateUpdateDto;
import archive.main.dto.documentdto.DocumentResponseDto;
import archive.main.entity.DocumentEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = MapperConfig.class)
public interface DocumentMapper {

    DocumentEntity toEntity(CreateUpdateDto documentDto);

    @Mapping(source = "category.name", target = "category")
    DocumentResponseDto toResponseDto(DocumentEntity entity);

}
