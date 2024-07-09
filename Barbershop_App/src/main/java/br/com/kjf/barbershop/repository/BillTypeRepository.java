package br.com.kjf.barbershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.kjf.barbershop.vo.BillTypeVO;

public interface BillTypeRepository extends JpaRepository<BillTypeVO, Integer> {

	@Query("FROM BillTypeVO WHERE id = :id")
	public BillTypeVO getById(@Param("id")int id);
	
}
