package br.com.kjf.barbershop.vo;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
	private String name;
	private String image_url;
	@Temporal(TemporalType.DATE)
	private LocalDate birthDate;
	private String cpf;
	@Column(nullable = false)
	private Boolean active;
	@ManyToOne
	@JoinColumn(name = "planos_id", nullable = false)
	private PlansVO plano;
	private Date renovation;
	@OneToOne(mappedBy = "client")
	@JsonIgnore
	private UserVO user;
	@OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<BookingVO> bookings;
	
	public ClientVO() {
		super();
	}
	
	public String getImage_url() {
		return image_url;
	}

	public void setImage_url(String image_url) {
		this.image_url = image_url;
	}

	public PlansVO getPlano() {
		return plano;
	}

	public void setPlano(PlansVO plano) {
		this.plano = plano;
	}

	public Date getRenovation() {
		return renovation;
	}

	public void setRenovation(Date renovation) {
		this.renovation = renovation;
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
	
}
