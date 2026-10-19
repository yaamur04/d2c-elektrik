
//hamb menu//

const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {

    menuButton.addEventListener("click", function() {

        navLinks.classList.toggle("active");

        if (navLinks.classList.contains("active")) {
            menuButton.textContent = "✕";
        } else {
            menuButton.textContent = "☰";
        }

    });

    const menuLinks = document.querySelectorAll(".nav-links a");

    menuLinks.forEach(function(link) {

        link.addEventListener("click", function() {

            navLinks.classList.remove("active");
            menuButton.textContent = "☰";

        });

    });

}


//hizmet kartları//


const serviceCards = document.querySelectorAll(".service-card");

serviceCards.forEach(function(card) {
    card.addEventListener("click", function() {

        serviceCards.forEach(function(otherCard) {
            if (otherCard !== card) {
                otherCard.classList.remove("open");

                const otherMore = otherCard.querySelector(".more");
                otherMore.textContent = "Detaylı İncele →";
            }
        });

        card.classList.toggle("open");

        const more = card.querySelector(".more");

        if (card.classList.contains("open")) {
            more.textContent = "Detayları Gizle ↑";
        } else {
            more.textContent = "Detaylı İncele →";
        }
    });
});
 
// Filter buttons and project cards//

const filterButtons = document.querySelectorAll(".filter-pill");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const selectedFilter = button.dataset.filter;

        // Aktif butonu değiştir
        filterButtons.forEach(function(otherButton) {
            otherButton.classList.remove("active");
        });

        button.classList.add("active");


        // Projeleri filtrele
        projectCards.forEach(function(card) {

            const category = card.dataset.category;

            if (selectedFilter === "all" || category === selectedFilter) {
              card.style.display = "";
           } else {
      card.style.display = "none";
      }
        });

    });

});

    //projeler//
const projectModal = document.getElementById("projectModal");

const projects = {

  konut1: {
    category: "Konut",
    title: "Örnek Konut Projesi",
    image: "images/konut1.jpg",
    description: "Konutun elektrik tesisatı, aydınlatma sistemleri, elektrik panosu ve zayıf akım altyapısı gerçekleştirildi.",
    location: "İstanbul",
    service: "Elektrik Tesisatı",
    duration: "3 Hafta"
  },

  ticari1: {
    category: "Ticari",
    title: "Örnek Ticari Proje",
    image: "images/ticari1.jpg",
    description: "Ticari alanın elektrik tesisatı, aydınlatma ve pano montajı gerçekleştirildi.",
    location: "İstanbul",
    service: "Elektrik & Aydınlatma",
    duration: "2 Hafta"
  },

  saglik1: {
    category: "Sağlık",
    title: "Örnek Sağlık Projesi",
    image: "images/saglik1.jpg",
    description: "Sağlık yapısında elektrik tesisatı, topraklama ve kesintisiz güç sistemleri uygulandı.",
    location: "İstanbul",
    service: "Elektrik & Güç Sistemleri",
    duration: "4 Hafta"
  }

};

function openProject(projectId) {

    const project = projects[projectId];

    if (!project || !projectModal) return;

    document.getElementById("modalCategory").textContent = project.category;
    document.getElementById("modalTitle").textContent = project.title;
    document.getElementById("modalDescription").textContent = project.description;
    document.getElementById("modalLocation").textContent = project.location;
    document.getElementById("modalService").textContent = project.service;
    document.getElementById("modalDuration").textContent = project.duration;

    const modalImage = document.getElementById("modalImage");

    modalImage.src = project.image;
    modalImage.alt = project.title;

    projectModal.classList.add("active");

    document.body.style.overflow = "hidden";
}


function closeProject() {

    if (!projectModal) return;

    projectModal.classList.remove("active");

    document.body.style.overflow = "";

}


if (projectModal) {

    projectModal.addEventListener("click", function(e) {

        if (e.target === projectModal) {
            closeProject();
        }

    });

}


document.addEventListener("keydown", function(e) {

    if (e.key === "Escape") {
        closeProject();
    }

});

//supabase//

(function () {
  // ↓↓↓ BURAYA KENDİ BİLGİLERİNİ YAPIŞTIRINIZ ↓↓↓
  const SUPABASE_URL = "https://kqvocbnlwpzcljtcxtdq.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_nbdP-7GwAuB7PzBnveJOnw_Bjj2OXkP";
  // ↑↑↑ BURAYA KENDİ BİLGİLERİNİ YAPIŞTIR ↑↑↑

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

//yorumlar//

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function yildizYaz(puan) {
    const p = parseInt(puan, 10);
    return "★".repeat(p) + "☆".repeat(5 - p);
  }

  function tarihFormatla(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("tr-TR");
  }

  async function listeyiCiz() {
    const liste = document.getElementById("yorum-listesi");

    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      liste.innerHTML = '<p style="opacity:.7;">Yorumlar yüklenemedi.</p>';
      console.error(error);
      return;
    }

    if (!data || data.length === 0) {
      liste.innerHTML = '<p style="opacity:.7;">Henüz yorum eklenmedi. İlk yorumu siz bırakın!</p>';
      return;
    }

    liste.innerHTML = data
      .map(function (y) {
        return (
          '<div class="partner-chip" style="text-align:left; padding:16px; width:100%;">' +
          '<div style="display:flex; justify-content:space-between; align-items:center;">' +
          "<strong>" + escapeHtml(y.isim) + "</strong>" +
          '<span style="color:#f5a623;">' + yildizYaz(y.puan) + "</span>" +
          "</div>" +
          '<p style="margin:8px 0 4px;">' + escapeHtml(y.metin) + "</p>" +
          '<small style="opacity:.6;">' + tarihFormatla(y.created_at) + "</small>" +
          "</div>"
        );
      })
      .join("");
  }

  document.getElementById("yorum-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const durum = document.getElementById("yorum-durum");
    const isim = document.getElementById("yorum-isim").value.trim();
    const puan = document.getElementById("yorum-puan").value;
    const metin = document.getElementById("yorum-metin").value.trim();

    if (!isim || !metin) return;

    durum.textContent = "Gönderiliyor...";
    durum.style.color = "inherit";

    const { error } = await supabase
      .from("comments")
      .insert([{ isim: isim, puan: parseInt(puan, 10), metin: metin }]);

    if (error) {
      durum.textContent = "Bir hata oluştu, tekrar deneyin.";
      durum.style.color = "red";
      console.error(error);
      return;
    }

    durum.textContent = "Teşekkürler! Yorumunuz eklendi.";
    durum.style.color = "green";
    this.reset();
    listeyiCiz();
  });

listeyiCiz();
// ================================
// TEKLİF FORMU
// ================================

const teklifForm = document.getElementById("teklif-form");

if (teklifForm) {

    teklifForm.addEventListener("submit", async function(e) {

        e.preventDefault();

        const button = teklifForm.querySelector("button[type='submit']");

        const ad = document.getElementById("ad").value.trim();
        const telefon = document.getElementById("tel").value.trim();
        const eposta = document.getElementById("eposta").value.trim();
        const projeTuru = document.getElementById("tur").value;
        const mesaj = document.getElementById("mesaj").value.trim();

        const hizmetler = Array.from(
            teklifForm.querySelectorAll(
                'input[name="hizmet[]"]:checked'
            )
        ).map(function(checkbox) {
            return checkbox.value;
        });


        if (!ad || !telefon) {
            alert("Lütfen ad soyad ve telefon numaranızı girin.");
            return;
        }


        button.disabled = true;
        button.textContent = "Gönderiliyor...";


        const { error } = await supabase
            .from("quote_requests")
            .insert([
                {
                    ad: ad,
                    telefon: telefon,
                    eposta: eposta || null,
                    proje_turu: projeTuru,
                    hizmetler: hizmetler,
                    mesaj: mesaj || null
                }
            ]);


        if (error) {

            console.error(error);

            alert(
                "Teklif gönderilirken bir hata oluştu. " +
                "Lütfen tekrar deneyin."
            );

            button.disabled = false;
            button.textContent = "Teklif Talebini Gönder";

            return;
        }


        alert(
            "Teklif talebiniz başarıyla gönderildi. " +
            "En kısa sürede sizinle iletişime geçeceğiz."
        );


        teklifForm.reset();

        button.disabled = false;
        button.textContent = "Teklif Talebini Gönder";

    });

}

})();

