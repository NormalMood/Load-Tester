package com.example.backend.model;

public class ServerCommandModel {
	
	public static final String GET_USED_MEMORY_COMMAND = "top -n1 | grep -m1 \"Mem\" | awk '{printf \"%.2f\\n\", $2/1024}'";
	
	public static final String GET_CPU_LOAD_COMMAND = "top -n1 | grep -m1 \"CPU\" | grep -oE '[0-9]+% [a-zA-Z]+' | grep -v 'idle' | awk '{sum += $1} END {print sum}'";

}
