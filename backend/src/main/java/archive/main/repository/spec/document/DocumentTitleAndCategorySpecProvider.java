package archive.main.repository.spec.document;

import archive.main.repository.spec.SpecProvider;
import archive.main.entity.DocumentEntity;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class DocumentTitleAndCategorySpecProvider implements SpecProvider<DocumentEntity> {

    @Override
    public String getKey() {
        return "titlesAndCategories";
    }

    @Override
    public Specification<DocumentEntity> getSpecification(String[] params) {
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();

            for (String param : params) {
                String pattern = "%" + param.toLowerCase() + "%";

                Predicate titlePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), pattern);
                Predicate categoryPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("category").get("name")), pattern);

                predicate = criteriaBuilder.or(titlePredicate, categoryPredicate);
            }
            return predicate;
        };
    }
}