
import prompt from "prompt-sync";
import { Conta, Cliente, Banco } from "./banco";

const input = prompt();

class App {
    banco: Banco;

    constructor() {
        this.banco = new Banco();
    }

    // Executa uma operação e apresenta erros.
    executar(operacao: () => void): void {
        try {
            operacao();
        } catch (erro) {
            console.log("Erro:", (erro as Error).message);
        }
    }

    menu(): void {
        let opcao = "";

        do {
            console.log("\n========== BEM-VINDO AO BANCO ==========");

            console.log("\nCONTAS:");
            console.log("00 - Inserir conta");
            console.log("01 - Consultar conta");
            console.log("02 - Sacar");
            console.log("03 - Depositar");
            console.log("04 - Excluir conta");
            console.log("05 - Transferir");
            console.log("06 - Atualizar conta");
            console.log("07 - Totalizações");
            console.log("08 - Ordem bancária");
            console.log("09 - Contas sem titular");

            console.log("\nCLIENTES:");
            console.log("20 - Inserir cliente");
            console.log("21 - Consultar cliente");
            console.log("22 - Associar conta a cliente");
            console.log("23 - Excluir cliente");
            console.log("24 - Mudar titularidade");

            console.log("\n0 - Sair");

            opcao = input("\nDigite uma opção: ");

            switch (opcao) {
                case "00":
                    this.inserirConta();
                    break;

                case "01":
                    this.consultarConta();
                    break;

                case "02":
                    this.sacar();
                    break;

                case "03":
                    this.depositar();
                    break;

                case "04":
                    this.excluirConta();
                    break;

                case "05":
                    this.transferir();
                    break;

                case "06":
                    this.atualizarConta();
                    break;

                case "07":
                    this.totalizacoes();
                    break;

                case "08":
                    this.ordemBancaria();
                    break;

                case "09":
                    this.contasSemTitular();
                    break;

                case "20":
                    this.inserirCliente();
                    break;

                case "21":
                    this.consultarCliente();
                    break;

                case "22":
                    this.associarConta();
                    break;

                case "23":
                    this.excluirCliente();
                    break;

                case "24":
                    this.mudarTitularidade();
                    break;

                case "0":
                    break;

                default:
                    console.log("Opção inválida!");
            }

            if (opcao !== "0") {
                input("\nOperação finalizada. Digite <enter> para continuar...");
            }

        } while (opcao !== "0");

        console.log("\nAplicação encerrada!");
    }

    // =========================
    // CONTAS
    // =========================

    inserirConta(): void {
        console.log("\n--- CADASTRAR CONTA ---");

        const numero = input("Número da conta: ");
        const saldo = Number(input("Saldo inicial: "));

        this.executar(() => {
            const conta = new Conta(numero, saldo);
            this.banco.inserir(conta);

            console.log("Conta cadastrada com sucesso!");
        });
    }

    consultarConta(): void {
        console.log("\n--- CONSULTAR CONTA ---");

        const numero = input("Número da conta: ");

        this.executar(() => {
            const conta = this.banco.consultar(numero);

            console.log("ID:", conta.id);
            console.log("Número:", conta.numero);
            console.log("Saldo:", conta.saldo);
            console.log("Data de abertura:", conta.dataDeAbertura);
            console.log(
                "Titular:",
                conta.cliente ? conta.cliente.nome : "Sem titular"
            );
        });
    }

    sacar(): void {
        console.log("\n--- SAQUE ---");

        const numero = input("Número da conta: ");
        const valor = Number(input("Valor do saque: "));

        this.executar(() => {
            this.banco.sacar(numero, valor);
            console.log("Saque realizado com sucesso!");
        });
    }

    depositar(): void {
        console.log("\n--- DEPÓSITO ---");

        const numero = input("Número da conta: ");
        const valor = Number(input("Valor do depósito: "));

        this.executar(() => {
            this.banco.depositar(numero, valor);
            console.log("Depósito realizado com sucesso!");
        });
    }

    excluirConta(): void {
        console.log("\n--- EXCLUIR CONTA ---");

        const numero = input("Número da conta: ");

        this.executar(() => {
            this.banco.excluir(numero);
            console.log("Conta excluída com sucesso!");
        });
    }

    transferir(): void {
        console.log("\n--- TRANSFERÊNCIA ---");

        const origem = input("Conta de origem: ");
        const destino = input("Conta de destino: ");
        const valor = Number(input("Valor: "));

        this.executar(() => {
            this.banco.transferir(origem, destino, valor);
            console.log("Transferência realizada!");
        });
    }

    atualizarConta(): void {
        console.log("\n--- ATUALIZAR CONTA ---");

        const numero = input("Número atual da conta: ");
        const novoNumero = input("Novo número da conta: ");
        const novoSaldo = Number(input("Novo saldo: "));

        this.executar(() => {
            this.banco.atualizar(numero, novoNumero, novoSaldo);
            console.log("Conta atualizada!");
        });
    }

    totalizacoes(): void {
        console.log("\n--- TOTALIZAÇÕES ---");

        console.log(
            "Quantidade de contas:",
            this.banco.quantidadeContas()
        );

        console.log(
            "Total depositado:",
            this.banco.totalDinheiro()
        );

        console.log(
            "Média dos saldos:",
            this.banco.mediaSaldo()
        );
    }

    ordemBancaria(): void {
        console.log("\n--- ORDEM BANCÁRIA ---");

        const origem = input("Conta de origem: ");

        const numeros = input(
            "Números das contas destino (separados por vírgula): "
        );

        const destinos = numeros
            .split(",")
            .map(numero => numero.trim());

        const valor = Number(input("Valor para cada conta: "));

        this.executar(() => {
            this.banco.ordemBancaria(origem, destinos, valor);
            console.log("Ordem bancária realizada!");
        });
    }

    contasSemTitular(): void {
        console.log("\n--- CONTAS SEM TITULAR ---");

        const contas = this.banco.listarContasSemCliente();

        if (contas.length === 0) {
            console.log("Não existem contas sem titular.");
            return;
        }

        for (const conta of contas) {
            console.log(
                `Número: ${conta.numero} | Saldo: ${conta.saldo}`
            );
        }

        const numero = input(
            "\nDigite o número da conta que deseja atribuir: "
        );

        const cpf = input("CPF do novo titular: ");

        this.executar(() => {
            this.banco.atribuirTitularidade(numero, cpf);
            console.log("Titularidade atribuída com sucesso!");
        });
    }

    // =========================
    // CLIENTES
    // =========================

    inserirCliente(): void {
        console.log("\n--- CADASTRAR CLIENTE ---");

        const id = Number(input("ID do cliente: "));
        const nome = input("Nome: ");
        const cpf = input("CPF: ");
        const data = input("Data de nascimento (AAAA-MM-DD): ");

        this.executar(() => {
            const cliente = new Cliente(
                id,
                nome,
                cpf,
                new Date(data)
            );

            this.banco.inserirCliente(cliente);

            console.log("Cliente cadastrado com sucesso!");
        });
    }

    consultarCliente(): void {
        console.log("\n--- CONSULTAR CLIENTE ---");

        const cpf = input("CPF do cliente: ");

        this.executar(() => {
            const cliente = this.banco.consultarCliente(cpf);

            console.log("ID:", cliente.id);
            console.log("Nome:", cliente.nome);
            console.log("CPF:", cliente.cpf);
            console.log("Data de nascimento:", cliente.dataNascimento);

            console.log("\nContas do cliente:");

            if (cliente.contas.length === 0) {
                console.log("Nenhuma conta associada.");
            }

            for (const conta of cliente.contas) {
                console.log(
                    `Número: ${conta.numero} | Saldo: ${conta.saldo}`
                );
            }

            console.log(
                "Saldo total:",
                this.banco.totalizarSaldoCliente(cpf)
            );
        });
    }

    associarConta(): void {
        console.log("\n--- ASSOCIAR CONTA A CLIENTE ---");

        const numero = input("Número da conta: ");
        const cpf = input("CPF do cliente: ");

        this.executar(() => {
            this.banco.associarContaCliente(numero, cpf);
            console.log("Conta associada com sucesso!");
        });
    }

    excluirCliente(): void {
        console.log("\n--- EXCLUIR CLIENTE ---");

        const cpf = input("CPF do cliente: ");

        this.executar(() => {
            this.banco.excluirCliente(cpf);

            console.log("Cliente excluído!");
            console.log("Suas contas permaneceram sem titular.");
        });
    }

    mudarTitularidade(): void {
        console.log("\n--- MUDAR TITULARIDADE ---");

        const numero = input("Número da conta: ");
        const cpf = input("CPF do novo titular: ");

        this.executar(() => {
            this.banco.mudarTitularidade(numero, cpf);
            console.log("Titularidade alterada com sucesso!");
        });
    }
}

// =========================
// EXECUÇÃO DO PROGRAMA
// =========================

const app = new App();

app.banco.carregarDados();

app.menu();
