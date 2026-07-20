package com.fintech.credit.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "banks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Bank {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String bankName;
}
