package archive.main.repository.spec.document;

import archive.main.repository.spec.SpecProvider;
import archive.main.entity.DocumentEntity;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class DocumentCategorySpecProvider implements SpecProvider<DocumentEntity> {

    @Override
    public String getKey() {
        return "categories";
    }

    @Override
    public Specification<DocumentEntity> getSpecification(String[] params) {
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();

            for (String param : params) {
                String pattern = "%" + param.toLowerCase() + "%";
                Expression<String> titleToLowerCase = criteriaBuilder.lower(root.get("category").get("name"));
                predicate = criteriaBuilder
                        .and(predicate, criteriaBuilder.like(titleToLowerCase, pattern));
            }
            return predicate;
        };
    }
}
