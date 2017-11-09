package com.thenamebook.namebook_api;

import org.springframework.data.repository.CrudRepository;

import com.thenamebook.namebook_api.Student;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete

public interface StudentRepository extends CrudRepository<Student, Long> {

}