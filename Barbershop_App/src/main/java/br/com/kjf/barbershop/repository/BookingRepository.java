package br.com.kjf.barbershop.repository;

import java.util.GregorianCalendar;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.kjf.barbershop.vo.BookingVO;

public interface BookingRepository extends JpaRepository<BookingVO, Integer>{

	@Query("FROM BookingVO WHERE bookingDate > :date")
	public List<BookingVO> findNextBooks(@Param("date") GregorianCalendar date);
	
}
