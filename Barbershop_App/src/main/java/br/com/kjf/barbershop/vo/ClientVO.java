package br.com.kjf.barbershop.vo;

import java.time.LocalDate;
import java.util.List;
import jakarta.persistence.CascadeType;
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
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "client")
public class ClientVO {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@Column(nullable = false)
	private String name;
	@Temporal(TemporalType.DATE)
	private LocalDate birthDate;
	@Column(nullable = false)
	private String cpf;
	@Column(nullable = false)
	private Boolean active;
	@ManyToOne
	@JoinColumn(name = "planos_id", nullable = false)
	private PlansVO plano;
	@OneToOne(mappedBy = "client")
	private UserVO user;
	@OneToMany(mappedBy = "client_vo", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<BookingVO> bookings;
	
	public ClientVO() {
		super();
	}

	public ClientVO(Integer id, String name, LocalDate birthDate, String cpf, Boolean active, PlansVO plan, UserVO user,
			List<BookingVO> bookings) {
		super();
		this.id = id;
		this.name = name;
		this.birthDate = birthDate;
		this.cpf = cpf;
		this.active = active;
		this.user = user;
		this.bookings = bookings;
		this.plano = plan;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public LocalDate getBirthDate() {
		return birthDate;
	}

	public void setBirthDate(LocalDate birthDate) {
		this.birthDate = birthDate;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}

	public List<BookingVO> getBookings() {
		return bookings;
	}

	public void setBookings(List<BookingVO> bookings) {
		this.bookings = bookings;
	}

	public PlansVO getPlanos() {
		return plano;
	}

	public void setPlanos(PlansVO planos) {
		this.plano = planos;
	}
	
}
