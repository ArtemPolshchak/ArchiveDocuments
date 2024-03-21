package archive.main.repository.spec;

public interface SpecProviderManager<T> {
    SpecProvider<T> getSpecProvider(String key);
}
