package br.com.kjf.barbershop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import br.com.kjf.barbershop.vo.ClientVO;

public interface ClientRepository extends JpaRepository<ClientVO, Integer> {

	@Query("FROM ClientVO WHERE FUNCTION('MONTH', birthDate) = FUNCTION('MONTH', CURRENT_DATE) AND FUNCTION('DAY', birthDate) = FUNCTION('DAY', CURRENT_DATE)")
	public List<ClientVO> getTodayBirths();
	
	@Query("FROM ClientVO WHERE FUNCTION('MONTH', birthDate) = FUNCTION('MONTH', CURRENT_DATE)")
	public List<ClientVO> getMonthBirths();
	
}
