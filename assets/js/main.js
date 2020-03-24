window.onload = function() {
    var loc = location.href
    $(".scrollToTop").click(function() {
        $("html,body").animate({
            scrollTop: 0
        }, '1000')
    });
    if (-1 != loc.indexOf("index.html")) {
        slideShowBTS();
        slideShowCover()
    }
    if (-1 != loc.indexOf("albums.html")) {
        document.getElementById('ddListType').addEventListener("change", filtrirajPoTipuAlbuma);
        document.getElementById('ddListLang').addEventListener("change", filtrirajPoJeziku);
        document.querySelector("#sortDesc").addEventListener("click", sortirajPoCeniDesc);
        document.querySelector("#sortAsc").addEventListener("click", sortirajPoCeniAsc)
        document.getElementById("pretraga").addEventListener("keyup", filterPretraga)
    }
    if (-1 != loc.indexOf("contact.html")) {
        document.getElementById("button").addEventListener("click", obradaForme)
    }
    if (-1 != loc.indexOf("cart.html")) {
        cart()
    }
    $.ajax({
        url: "assets/data/menu.json",
        method: "get",
        dataType: "json",
        success: function(menu) {
            ispisMenija(menu)
        },
        error: function(err) {
            console.log(err)
        }
    })
    $.ajax({
        url: "assets/data/albums.json",
        method: "get",
        dataType: "json",
        success: function(albums) {
            if (-1 != loc.indexOf("index.html")) {
                prikazPoDatumuNajnoviji(albums);
                prikazivanjeOurPick(albums)
            } else if (-1 != loc.indexOf("albums.html")) {
                ispisAlbuma(albums)
            }
        },
        error: function(err) {
            console.error(err)
        }
    })
    $.ajax({
        url: "assets/data/type.json",
        method: "get",
        dataType: "json",
        success: function(types) {
            if (-1 != loc.indexOf("albums.html")) {
                ispisListeTipova(types)
            }
        },
        error: function(err) {
            console.log(err)
        }
    })
    $.ajax({
        url: "assets/data/language.json",
        method: "get",
        dataType: "json",
        success: function(language) {
            if (-1 != loc.indexOf("albums.html")) {
                ispisJezika(language)
            }
        },
        error: function(err) {
            console.log(err)
        }
    })
}

function slideShowBTS() {
    let trenutna = $("#photoSlider .aktivna");
    let sledeca = trenutna.next().length ? trenutna.next() : trenutna.parent().children(':first');
    trenutna.removeClass('aktivna');
    sledeca.addClass('aktivna');
    setTimeout(slideShowBTS, 1500)
}

function slideShowCover() {
    let trenutna = $("#slider .aktivna");
    let sledeca = trenutna.next().length ? trenutna.next() : trenutna.parent().children(':first');
    trenutna.removeClass('aktivna');
    sledeca.addClass('aktivna');
    setTimeout(slideShowCover, 1200)
}

function ispisMenija(menu) {
    let ispisMenu = "";
    for (var meni of menu) {
        ispisMenu += `<li><a href="${meni.href}" class="text-decoration-none text-body">${meni.name}</a></li>`
    }
    document.getElementById("nav").innerHTML = ispisMenu;
    document.getElementById("menuInFooter").innerHTML = ispisMenu
}

function prikazPoDatumuNajnoviji(albums) {
    $.ajax({
        url: "assets/data/albums.json",
        method: "get",
        dataType: "json",
        success: function(albums) {
            albums = albums.sort(function(a, b) {
                var datum1 = new Date(a.dateRelease);
                var datum2 = new Date(a.dateRelease);
                return (Date.UTC(datum2.getFullYear(), datum2.getMonth(), datum2.getDate()) - Date.UTC(datum1.getFullYear(), datum1.getMonth(), datum1.getDate()))
            })
            var najnovijiAlbumi = albums.slice(0, 3);
            let ispisNajnovijih = "";
            najnovijiAlbumi.forEach(album => {
                ispisNajnovijih += `<div class="col-lg-4 col-md-6 col-12>
                <div class="card">
                    <div class="card-body najnoviji">
                        <img src="${album.picture.src}" alt="${album.picture.alt}" class="img-fluid card-img-top"/>
                        <h2 class="text-center pt-2 card-title">${album.name}</h2>
                        <p class="pt-3">Release Date: ${album.dateRelease}</p>
                        <p>Type of the Album: ${album.typeOfAlbum.type}</p>
                        <p>Language: ${album.language.lang}</p>
                        <p>Price: ${album.price}</p>
                        <p class="card-text">${album.description}</p> 
                    </div>
                    <div class="card-footer">
                        <small class="text-muted">To see more albums: <a href="albums.html" class="text-decoration-none">CLICK HERE</a></small>
                    </div>
                </div>
                </div>`
            })
            document.getElementById("latest").innerHTML = ispisNajnovijih;
            $(".najnoviji img").hover(function() {
                $(this).animate({
                    opacity: "0.4"
                }, "slow")
            }, function() {
                $(this).animate({
                    opacity: "1"
                }, "slow")
            })
        },
        error: function(err) {
            console.log(err)
        }
    })
}

function ispisAlbuma(albums) {
    let ispisAlbuma = "";
    albums.forEach(album => {
        ispisAlbuma += `<div class="col-lg-4 col-md-6 col-12 karta">    
                <div class="card album pt-4 pb-3 text-center">
                    <div class="card-body">
                        <img src="${album.picture.src}" alt="${album.picture.alt}" class="img-fluid card-img-top"/>
                        <h2 class="card-title pt-2">${album.name}</h2>
                        <p class="card-text hearts">${ispisHearts(album.hearts)}</p>
                        <p class="card-text">Release Date: ${album.dateRelease}</p>
                        <p class="card-text">Type of the Album: ${album.typeOfAlbum.type}</p>
                        <p class="card-text">Language: ${album.language.lang}</p>
                        <p class="card-text">Price: ${album.price}</p>
                        <button class="btn btn-primary dugme text-body" data-id="${album.id}">ADD TO CART <i class='fas fa-shopping-cart'></i></button>
                    </div>
                </div>
            </div>`
    })
    document.getElementById("allAlbums").innerHTML = ispisAlbuma;
    $(".dugme").click(dodavanjeAlbumaUKorpu);
    $(".album").hover(function() {
        $(this).css({
            "boxShadow": "10px 10px 10px 12px rgba(0,0,0,.125)",
            "transition": "boxShadow 0.5s"
        })
    }, function() {
        $(this).css({
            "boxShadow": "none"
        })
    })
}

function ispisHearts(hearts) {
    var ispisHearts = "";
    for (let i = 1; i <= 5; i++) {
        if (i <= hearts) {
            ispisHearts += `<i class="fas fa-heart p-1"></i>`
        } else {
            ispisHearts += `<i class="far fa-heart p-1"></i>`
        }
    }
    return ispisHearts
}

function prikazivanjeOurPick(albums) {
    let ispisAlbuma = "";
    albums.forEach(a => {
        if (a.pick == 1) {
            ispisAlbuma += `<div class="col-12 mt-3 nasIzbor">
                <div class="slika">
                    <img src="${a.picture.src}" alt="${a.picture.alt}" class="img-fluid pl-5 pt-3 pb-3"/>
                </div>
                <div class="tekst pr-5">
                    <h2 class="text-center pt-3">${a.name}</h2>
                    <p class="text-justify pt-2">${a.description}</p>
                    <p>To see more albums: <a href="albums.html" class="text-decoration-none">CLICK HERE</a></p>
                </div>
        </div>`
        }
        document.getElementById("ourPick").innerHTML = ispisAlbuma
    })
}

function ispisListeTipova(types) {
    let ispis = "";
    types.forEach(t => {
        ispis += `<option value="${t.id}">${t.type}</option>`
    })
    document.getElementById("ddListType").innerHTML += ispis
}

function filtrirajPoTipuAlbuma() {
    var val = this.value;
    $.ajax({
        url: "assets/data/albums.json",
        method: "get",
        dataType: "json",
        success: function(albums) {
            filterPoTipu = albums.filter(el => {
                return el.typeOfAlbum.id == val
            })
            ispisAlbuma(filterPoTipu);
            if (val == 0) {
                ispisAlbuma(albums)
            }
        },
        error: function(err) {
            console.log(err)
        }
    })
}

function sortirajPoCeniDesc(albums) {
    $.ajax({
        url: "assets/data/albums.json",
        method: "get",
        dataType: "json",
        success: function(albums) {
            albums.sort(function(a, b) {
                if (a.price == b.price) {
                    return 0
                }
                return a.price > b.price ? -1 : 1
            })
            ispisAlbuma(albums)
        },
        error: function(err) {
            console.log(err)
        }
    })
}

function sortirajPoCeniAsc(albums) {
    $.ajax({
        url: "assets/data/albums.json",
        method: "get",
        dataType: "json",
        success: function(albums) {
            albums.sort(function(a, b) {
                if (a.price == b.price) {
                    return 0
                }
                return a.price > b.price ? 1 : -1
            })
            ispisAlbuma(albums)
        },
        error: function(err) {
            console.log(err)
        }
    })
}

function filterPretraga() {
    const korisnikUnos = this.value;
    $.ajax({
        url: "assets/data/albums.json",
        method: "get",
        dataType: "json",
        success: function(albums) {
            const filtriraniAlbumi = albums.filter(element => {
                if (element.name.toLowerCase().indexOf(korisnikUnos.toLowerCase()) !== -1) {
                    return !0
                }
            })
            if (filtriraniAlbumi.length) {
                ispisAlbuma(filtriraniAlbumi)
            } else {
                var nemaProizvoda = `<div class="col-12 p-5 nemaProizvoda"> <h3 class="text-center"><i class='fas fa-search'></i> There is nothing here. Please try again.</h3> </div>`;
                document.getElementById("allAlbums").innerHTML = nemaProizvoda
            }
        },
        error: function(err) {
            console.log(err)
        }
    })
}

function ispisJezika(language) {
    let ispis = "";
    language.forEach(l => {
        ispis += `<option value="${l.id}">${l.lang}</option>`
    })
    document.getElementById("ddListLang").innerHTML += ispis
}

function filtrirajPoJeziku() {
    var val = this.value;
    $.ajax({
        url: "assets/data/albums.json",
        method: "get",
        dataType: "json",
        success: function(albums) {
            filterPoJeziku = albums.filter(el => {
                return el.language.id == val
            })
            ispisAlbuma(filterPoJeziku);
            if (val == 0) {
                ispisAlbuma(albums)
            }
        },
        error: function(err) {
            console.log(err)
        }
    })
}

function obradaForme() {
    var imePrez = document.querySelector("#name").value;
    var email = document.querySelector("#email").value;
    var lozinka = document.querySelector("#password").value;
    var telefon = document.querySelector("#phone").value;
    var kartica = document.querySelector("#card").value;
    var regImePrez = /^[A-ZĆČŠĐŽ][a-zćčšđž]{3,20}(\s[A-ZĆČŠĐŽ][a-zćčšđž]{3,20})+$/;
    var regEmail = /^[a-z][a-z\d\_\.\-]+\@[a-z\d]+(\.[a-z]{2,4})+$/;
    var regLozinka = /^.{7,50}$/;
    var regTelefon = /^06[01234569]\/\d{3}\-\d{3,4}$/;
    var regKartica = /^\d{4}(\-\d{4}){3}$/;
    var greske = [];
    if (!regImePrez.test(imePrez)) {
        document.querySelector("#name").classList.add("bg-danger");
        document.querySelector("#name-error").textContent = "First and last name must begin with a capital letter, min 2 max 30 characters.";
        greske.push(imePrez)
    } else {
        document.querySelector("#name").classList.remove("bg-danger");
        document.querySelector("#name-error").textContent = ""
    }
    if (!regEmail.test(email)) {
        document.querySelector("#email").classList.add("bg-danger");
        document.querySelector("#email-error").textContent = "Email must be in this format: example@gmail.com";
        greske.push(email)
    } else {
        document.querySelector("#email").classList.remove("bg-danger");
        document.querySelector("#email-error").textContent = ""
    }
    if (!regLozinka.test(lozinka)) {
        document.querySelector("#password").classList.add("bg-danger");
        document.querySelector("#password-error").textContent = "Password must have min 7 and max 50 characters!";
        greske.push(lozinka)
    } else {
        document.querySelector("#password").classList.remove("bg-danger");
        document.querySelector("#password-error").textContent = ""
    }
    if (!regTelefon.test(telefon)) {
        document.querySelector("#phone").classList.add("bg-danger");
        document.querySelector("#phone-error").textContent = "Phone must be in format: 06x/xxx-xxx(x)";
        greske.push(lozinka)
    } else {
        document.querySelector("#phone").classList.remove("bg-danger");
        document.querySelector("#phone-error").textContent = ""
    }
    if (!regKartica.test(kartica)) {
        document.querySelector("#card").classList.add("bg-danger");
        document.querySelector("#card-error").textContent = "Card must be in format: 0000-0000-0000-0000!";
        greske.push(lozinka)
    } else {
        document.querySelector("#card").classList.remove("bg-danger");
        document.querySelector("#card-error").textContent = ""
    }
}

function dodavanjeAlbumaUKorpu() {
    let val = $(this).data("id");
    let albumi = [];
    if (localStorage.getItem("kupljenAlbum")) {
        albumi = JSON.parse(localStorage.getItem("kupljenAlbum"));
        if (albumi.filter(a => a.id == val).length) {
            albumi.forEach(proizvod => {
                if (proizvod.id == val) {
                    proizvod.kolicina++
                }
            });
            upisiLS("kupljenAlbum", albumi)
        } else {
            albumi.push({
                id: val,
                kolicina: 1
            });
            upisiLS("kupljenAlbum", albumi)
        }
    } else {
        albumi[0] = {
            id: val,
            kolicina: 1
        }
        upisiLS("kupljenAlbum", albumi)
    }
}

function upisiLS(naziv, vrednost) {
    if (localStorage) {
        localStorage.setItem(naziv, JSON.stringify(vrednost))
    }
}

function cart() {
    let praznaKorpa = `<div class="col-12 p-5 nemaProizvoda"> <h3 class="text-center"><i class='fas fa-shopping-cart'></i> Your cart is currently empty.</h3> </div>`;
    let konacnaCena = 0;
    if (localStorage.getItem("kupljenAlbum")) {
        $.ajax({
            url: "assets/data/albums.json",
            method: "get",
            dataType: "json",
            success: function(data) {
                let albumi = JSON.parse(localStorage.getItem("kupljenAlbum"));
                let kupljeniAlbumi = data.filter(a => {
                    for (let i = 0; i < albumi.length; i++) {
                        if (albumi[i].id == a.id) {
                            a.kolicina = albumi[i].kolicina;
                            return !0
                        }
                    }
                });
                if (kupljeniAlbumi.length) {
                    let ispisUKorpu = "";
                    kupljeniAlbumi.forEach(a => {
                        ispisUKorpu += `
                            <div class="col-lg-3 col-md-6 col-12 elementiKorpe">    
                                <div class="card album text-center">
                                    <div class="card-body">
                                        <img src="${a.picture.src}" alt="${a.picture.alt}" class="img-fluid card-img-top"/>
                                        <h2 class="card-title pt-2">${a.name}</h2>
                                        <p class="card-text">Price: ${a.price}</p>
                                        <p class="card-text">Quantity: ${a.kolicina}</p>
                                        <button class="btn btn-primary dugmeRemove text-body" data-id="${a.id}">REMOVE</button>
                                    </div>
                                </div>
                            </div>`
                    });
                    document.getElementById("cart").innerHTML = ispisUKorpu;
                    document.querySelector(".dugmeRemove").addEventListener("click", izbrisiIzLS)
                } else {
                    document.getElementById("cart").innerHTML = praznaKorpa
                }
            },
            error: function(err) {
                console.log(err)
            }
        })
    } else {
        document.getElementById("cart").innerHTML = praznaKorpa
    }
}

function izbrisiIzLS() {
    let val = $(this).data("id");
    let albumi = JSON.parse(localStorage.getItem("kupljenAlbum"));
    let filtiraniAlbumiLS = albumi.filter(a => a.id != val);
    upisiLS("kupljenAlbum", filtiraniAlbumiLS);
    cart()
}