package archive.main.repository.spec.document;

import archive.main.entity.DocumentEntity;
import archive.main.repository.spec.SpecProvider;
import archive.main.repository.spec.SpecProviderManager;
import archive.main.repository.spec.SpecificationBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;

@Component
@RequiredArgsConstructor
public class DocumentSpecBuilder implements SpecificationBuilder<DocumentEntity> {

    private final SpecProviderManager<DocumentEntity> specProviderManager;

    @Override
    public Specification<DocumentEntity> build(Record recordDto) {
        Specification<DocumentEntity> spec = Specification.where(null);

        for (Field declaredField : recordDto.getClass().getDeclaredFields()) {
            declaredField.setAccessible(true);
            try {
                if (declaredField.get(recordDto) != null) {
                    SpecProvider<DocumentEntity> specProvider = specProviderManager.getSpecProvider(declaredField.getName());
                    spec = spec.and(specProvider.getSpecification((String[]) declaredField.get(recordDto)));
                }
            } catch (IllegalAccessException e) {
                throw new RuntimeException(e);
            }
        }
        return spec;
    }
}
