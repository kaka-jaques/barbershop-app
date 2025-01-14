package br.com.kjf.barbershop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import br.com.kjf.barbershop.vo.WorkdayVO;

public interface WorkdayRepository extends JpaRepository<WorkdayVO, Integer> {

	@Query("FROM WorkdayVO WHERE id = 1")
	public WorkdayVO getWorkday();
	
}
