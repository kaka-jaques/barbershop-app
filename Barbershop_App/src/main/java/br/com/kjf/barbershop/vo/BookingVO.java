package br.com.kjf.barbershop.vo;

import java.util.GregorianCalendar;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "booking")
public class BookingVO {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@Column(nullable = false)
	private GregorianCalendar bookingDate;
	@ManyToOne
	@JoinColumn(name = "client_id", nullable = false)
	private ClientVO client_vo;
	
	public BookingVO() {
		super();
	}

	public BookingVO(Integer id, GregorianCalendar bookingDate, ClientVO client_vo) {
		super();
		this.id = id;
		this.bookingDate = bookingDate;
		this.client_vo = client_vo;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public GregorianCalendar getBookingDate() {
		return bookingDate;
	}

	public void setBookingDate(GregorianCalendar bookingDate) {
		this.bookingDate = bookingDate;
	}

	public ClientVO getClient_vo() {
		return client_vo;
	}

	public void setClient_vo(ClientVO client_vo) {
		this.client_vo = client_vo;
	}
	
}
