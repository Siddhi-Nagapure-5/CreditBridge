package com.fintech.credit.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @GetMapping("/dashboard")
    public ResponseEntity<String> getDashboard() {
        return ResponseEntity.ok("Welcome to User Dashboard");
    }
}
