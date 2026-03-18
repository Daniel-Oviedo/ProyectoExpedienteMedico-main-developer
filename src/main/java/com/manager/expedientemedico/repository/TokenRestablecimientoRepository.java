package com.manager.expedientemedico.repository;

import com.manager.expedientemedico.model.TokenRestablecimientoContrasena;
import com.manager.expedientemedico.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface TokenRestablecimientoRepository extends JpaRepository<TokenRestablecimientoContrasena, Long> {
    
    Optional<TokenRestablecimientoContrasena> findByToken(String token);
    
    Optional<TokenRestablecimientoContrasena> findByEmailAndUsado(String email, boolean usado);
    
    Optional<TokenRestablecimientoContrasena> findByUsuarioAndUsado(Usuario usuario, boolean usado);
    
    void deleteByExpiracionBefore(LocalDateTime fecha);
}
