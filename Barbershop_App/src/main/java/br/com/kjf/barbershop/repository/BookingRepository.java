package br.com.kjf.barbershop.repository;

import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.kjf.barbershop.vo.BookingVO;

public interface BookingRepository extends JpaRepository<BookingVO, Integer>{

	@Query("FROM BookingVO WHERE bookingDate > CURDATE()")
	public List<BookingVO> findNextBooks();
	
	@Query("FROM BookingVO WHERE bookingDate >= :today AND bookingDate < :tomorrow ")
	public List<BookingVO> getBooksForToday(@Param("today")GregorianCalendar today, @Param("tomorrow") Calendar tomorrow);
	
	@Query("FROM BookingVO WHERE bookingDate >= :per1 AND bookingDate < :per2")
	public List<BookingVO> getBooksForPeriod(@Param("per1")GregorianCalendar per1, @Param("per2")GregorianCalendar per2);
	
}
