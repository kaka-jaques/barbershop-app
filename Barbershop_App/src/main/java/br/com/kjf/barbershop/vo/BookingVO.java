package br.com.kjf.barbershop.vo;

import java.time.LocalTime;
import java.util.GregorianCalendar;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
	@ManyToOne
	@JoinColumn(name = "services_id")
	private ServicesVO services;
	@ManyToOne
	@JoinColumn(name = "client_id")
	private ClientVO client;
	@ManyToOne
	@JoinColumn(name = "barber_id")
	private UserVO barberman;
	private Boolean jobDone = false;
	private Boolean lockedTime;
	private LocalTime startLockTime;
	private LocalTime endLockTime;
	
	//GETTERS AND SETTERS
	
	public UserVO getBarberman() {
		return barberman;
	}

	public Boolean getLockedTime() {
		return lockedTime;
	}

	public void setLockedTime(Boolean lockedTime) {
		this.lockedTime = lockedTime;
	}

	public LocalTime getStartLockTime() {
		return startLockTime;
	}

	public void setStartLockTime(LocalTime startLockTime) {
		this.startLockTime = startLockTime;
	}

	public LocalTime getEndLockTime() {
		return endLockTime;
	}

	public void setEndLockTime(LocalTime endLockTime) {
		this.endLockTime = endLockTime;
	}

	public Boolean getJobDone() {
		return jobDone;
	}

	public void setJobDone(Boolean jobDone) {
		this.jobDone = jobDone;
	}

	public void setBarberman(UserVO barberman) {
		this.barberman = barberman;
	}

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
