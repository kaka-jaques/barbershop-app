package br.com.kjf.barbershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.kjf.barbershop.vo.ClientVO;

public interface ClientRepository extends JpaRepository<ClientVO, Integer> {

}
