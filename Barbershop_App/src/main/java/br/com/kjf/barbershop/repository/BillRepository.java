package br.com.kjf.barbershop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.kjf.barbershop.vo.BillVO;

public interface BillRepository extends JpaRepository<BillVO, Integer> {

	@Query("FROM BillVO WHERE paid = false and day >= FUNCTION('DAY', CURRENT_DATE) and month = FUNCTION('MONTH', CURRENT_DATE) and year = FUNCTION('YEAR', CURRENT_DATE)")
	public List<BillVO> getPendingMonthBills();
	
	@Query("FROM BillVO WHERE paid = false and day < FUNCTION('DAY', CURRENT_DATE) and month <= FUNCTION('MONTH', CURRENT_DATE) and year <= FUNCTION('YEAR', CURRENT_DATE)")
	public List<BillVO> getExpiredBills();
	
	@Query("FROM BillVO WHERE day >= 1 and day <= 31 and month = :month and year = :year")
	public List<BillVO> getMonthBills(@Param("month")int month, @Param("year")int year);
}
