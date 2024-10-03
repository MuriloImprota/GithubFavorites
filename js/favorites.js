import { githubUser } from "./githubUser.js";


export class favorites {

    constructor(root) {
        this.root = document.querySelector(root) //é instanciado o root, na qual, recebe os parametros da tag #app no root
        this.load()
    }

    load() {
        this.users = JSON.parse(localStorage.getItem("@github-favorites:")) || [];

        console.log(this.users)

        githubUser.search("MuriloImprota").then(user => console.log(user))
    }

    saveData() {
        localStorage.setItem("@github-favorites:", JSON.stringify(this.users))
    }

    async add(username) {
        try {
            const userExists = this.users.find(user => user.login === username)
            console.log(userExists)

            if (userExists) {
                throw new Error("Usuário já cadastrado")
            }

            const user = await githubUser.search(username)
            if (user.login === undefined) {
                throw new Error("Usuario não encontrado")

            }

            this.users = [user, ...this.users]
            this.update()
            this.saveData()

        } catch (error) {
            alert(error.message)
        }

    }

    delete(user) {
        const filteredusers = this.users.filter(entry =>
            entry.login !== user.login)

        this.users = filteredusers
        this.update()
        this.saveData()
    }
}

export class favoritesView extends favorites {

    constructor(root) { //a class favoritesview, herda tudo da classe favoritos com o atributo super 
        super(root)
        this.tbody = this.root.querySelector("table tbody")
        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector(".search button")
        addButton.onclick = () => {
            const { value } = this.root.querySelector(".search input")
            this.add(value)
        }
    }

    update() {
        this.removeallTr()

        this.users.forEach(user => {
            const row = this.createRow()
            
            row.querySelector(".user img").src = `https://github.com/${user.login}.png`
            row.querySelector(".user img").alt = `Imagem de ${user.name}`
            row.querySelector(".user a").href = `https://github.com/${user.login}`
            row.querySelector(".user p").textContent = user.name
            row.querySelector(".user span").textContent = user.login
            row.querySelector(".Repositories").textContent = user.public_repos
            row.querySelector(".Followers").textContent = user.followers
            row.querySelector(".remove").onclick = () => {
                const isOkay = confirm("Tem certeza que deseja excluir essa linha?")
                if (isOkay) {
                    this.delete(user)
                }
            }
            this.tbody.append(row)

        })

    }

    createRow() {
        const tr = document.createElement("tr")

        tr.innerHTML = `
        <td class="user">
            <img src="https://github.com/MuriloImprota.png" alt="imagem do usuario">
            <a href="https://github.com/MuriloImprota" target="_blank">
                <p>Murilo Improta</p>
                <span>MuriloImprota</span>
            </a>
        </td>
        <td class="Repositories">
            14
        </td>
        <td class="Followers">
            9000
        </td>
        <td>
            <button class="remove">&times;</button>
        </td>
`

        return tr
    }

    removeallTr() {

        this.tbody.querySelectorAll("tr")
            .forEach((tr) => {
                tr.remove()
            })

    }
}

