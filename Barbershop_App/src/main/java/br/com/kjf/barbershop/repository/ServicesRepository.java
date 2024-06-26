package br.com.kjf.barbershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.kjf.barbershop.vo.ServicesVO;

public interface ServicesRepository extends JpaRepository<ServicesVO, Integer>{

}
