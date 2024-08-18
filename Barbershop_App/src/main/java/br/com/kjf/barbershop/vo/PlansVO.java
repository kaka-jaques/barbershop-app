package br.com.kjf.barbershop.vo;

import java.util.List;

import org.hibernate.annotations.ForeignKey;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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
	@ManyToMany(cascade = CascadeType.ALL)
	@JoinTable(name = "plans_service")
	private List<ServicesVO> services_include; //CONFIGURAR NO BANCO DE DADOS O RELACIONAMENTO DAS FOREIGN KEYS EM UPDATE E DELETE COMO 'CASCADE'
	
	public List<ServicesVO> getServices_include() {
		return services_include;
	}

	public void setServices_include(List<ServicesVO> services_include) {
		this.services_include = services_include;
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
	
}
