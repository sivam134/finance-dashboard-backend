package org.fta.dto.customcategory;

import lombok.Data;

@Data
public class CreateCustomCategoryDto {
    private String userId;
    private String categoryName;
    private String categoryDescription;
}
