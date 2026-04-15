package com.exe201.petdating.main.domain;

public enum PetSpecies {
    DOG("dog"),
    CAT("cat"),
    BIRD("bird"),
    RABBIT("rabbit"),
    HAMSTER("hamster"),
    GUINEA_PIG("guinea_pig"),
    OTHER("other");

    private final String value;

    PetSpecies(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
