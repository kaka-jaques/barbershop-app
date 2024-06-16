package br.com.kjf.barbershop.vo;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "planos")
public class PlansVO {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@Column(nullable = false)
	private String name;
	@Column(nullable = false)
	private String description;
	@Column(nullable = false)
	private Double price;
	@OneToMany(mappedBy = "plano", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ClientVO> clients;
	
	public PlansVO() {
		super();
	}

	public PlansVO(Integer id, String name, String description, Double price, List<ClientVO> clients) {
		super();
		this.id = id;
		this.name = name;
		this.description = description;
		this.price = price;
		this.clients = clients;
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

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public List<ClientVO> getClients() {
		return clients;
	}

	public void setClients(List<ClientVO> clients) {
		this.clients = clients;
	}
	
}
