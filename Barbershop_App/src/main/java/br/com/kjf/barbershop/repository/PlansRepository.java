package br.com.kjf.barbershop.repository;

import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import br.com.kjf.barbershop.vo.PlansVO;

public interface PlansRepository extends JpaRepository<PlansVO, Integer>{
	
	@Query("FROM PlansVO WHERE id = :id")
	public PlansVO findById(@Param("id") int id);
	
}
