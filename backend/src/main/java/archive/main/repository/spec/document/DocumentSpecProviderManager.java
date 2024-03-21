package archive.main.repository.spec.document;

import archive.main.repository.spec.SpecProvider;
import archive.main.repository.spec.SpecProviderManager;
import archive.main.entity.DocumentEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.NoSuchElementException;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DocumentSpecProviderManager implements SpecProviderManager<DocumentEntity> {

    private final Set<SpecProvider<DocumentEntity>> providers;

    @Override
    public SpecProvider<DocumentEntity> getSpecProvider(String key) {
        return providers.stream()
                .filter(provider -> provider.getKey().equals(key))
                .findFirst()
                .orElseThrow(NoSuchElementException::new);
    }
}
