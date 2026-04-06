package com.finance.dashboard.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryTotalDTO {

    private String category;
    private BigDecimal total;
}