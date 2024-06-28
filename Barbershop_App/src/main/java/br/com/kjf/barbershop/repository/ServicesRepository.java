package br.com.kjf.barbershop.repository;

import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import br.com.kjf.barbershop.vo.ServicesVO;

public interface ServicesRepository extends JpaRepository<ServicesVO, Integer>{

	@Query("FROM ServicesVO WHERE id = :id")
	public ServicesVO getServiceById(@Param("id")int id);
	
}
