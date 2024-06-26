package br.com.kjf.barbershop.vo;

import java.util.GregorianCalendar;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "booking")
public class BookingVO {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@Column(nullable = false)
	private GregorianCalendar bookingDate;
	@OneToOne
	@JoinColumn(name = "services_id", nullable = false)
	private ServicesVO services;
	@ManyToOne
	@JoinColumn(name = "client_id", nullable = false)
	private ClientVO client;
	
	public ServicesVO getServices() {
		return services;
	}

	public void setServices(ServicesVO services) {
		this.services = services;
	}

	public ClientVO getClient() {
		return client;
	}

	public void setClient(ClientVO client) {
		this.client = client;
	}

	public BookingVO() {
		super();
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
	
}
