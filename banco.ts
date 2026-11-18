
export class Cliente {
    id: number;
    nome: string;
    cpf: string;
    dataNascimento: Date;
    contas: Conta[];

    constructor(
        id: number,
        nome: string,
        cpf: string,
        dataNascimento: Date
    ) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
        this.contas = [];
    }
}

export class Conta {
    private static proximoId = 1;

    id: number;
    numero: string;
    saldo: number;
    cliente: Cliente | null;
    dataDeAbertura: Date;

    constructor(numero: string, saldo: number = 0) {
        this.id = Conta.proximoId++;
        this.numero = numero;
        this.saldo = saldo;
        this.cliente = null;
        this.dataDeAbertura = new Date();
    }
}

export class Banco {
    clientes: Cliente[];
    contas: Conta[];

    constructor() {
        this.clientes = [];
        this.contas = [];
    }

    // =========================
    // MÉTODOS DE CONTA
    // =========================

    inserir(conta: Conta): void {
        if (this.contas.some(c =>
            c.id === conta.id || c.numero === conta.numero
        )) {
            throw new Error("Conta já cadastrada!");
        }

        if (conta.saldo < 0) {
            throw new Error("Saldo inválido!");
        }

        this.contas.push(conta);
    }

    consultar(numero: string): Conta {
        const conta = this.contas.find(c => c.numero === numero);

        if (!conta) {
            throw new Error("Conta não encontrada!");
        }

        return conta;
    }

    excluir(numero: string): void {
        const conta = this.consultar(numero);

        if (conta.cliente !== null) {
            conta.cliente.contas =
                conta.cliente.contas.filter(c => c !== conta);
        }

        this.contas = this.contas.filter(c => c !== conta);
    }

    atualizar(
        numero: string,
        novoNumero: string,
        novoSaldo: number
    ): void {
        const conta = this.consultar(numero);

        const duplicada = this.contas.some(c =>
            c !== conta && c.numero === novoNumero
        );

        if (duplicada) {
            throw new Error("Já existe uma conta com esse número!");
        }

        if (novoSaldo < 0) {
            throw new Error("Saldo não pode ser negativo!");
        }

        conta.numero = novoNumero;
        conta.saldo = novoSaldo;
    }

    sacar(numero: string, valor: number): void {
        const conta = this.consultar(numero);

        if (valor <= 0) {
            throw new Error("Valor do saque inválido!");
        }

        if (conta.saldo < valor) {
            throw new Error("Saldo insuficiente!");
        }

        conta.saldo -= valor;
    }

    depositar(numero: string, valor: number): void {
        const conta = this.consultar(numero);

        if (valor <= 0) {
            throw new Error("Valor do depósito inválido!");
        }

        conta.saldo += valor;
    }

    transferir(
        numeroOrigem: string,
        numeroDestino: string,
        valor: number
    ): void {
        const origem = this.consultar(numeroOrigem);
        const destino = this.consultar(numeroDestino);

        if (numeroOrigem === numeroDestino) {
            throw new Error("Não é possível transferir para a mesma conta!");
        }

        if (valor <= 0) {
            throw new Error("Valor da transferência inválido!");
        }

        if (origem.saldo < valor) {
            throw new Error("Saldo insuficiente!");
        }

        origem.saldo -= valor;
        destino.saldo += valor;
    }

    // Ordem bancária: transfere o mesmo valor
    // para cada conta de destino.
    ordemBancaria(
        numeroOrigem: string,
        contasDestino: string[],
        valor: number
    ): void {
        const origem = this.consultar(numeroOrigem);

        if (valor <= 0 || contasDestino.length === 0) {
            throw new Error("Dados da ordem bancária inválidos!");
        }

        const destinos = contasDestino.map(numero =>
            this.consultar(numero)
        );

        if (destinos.some(c => c === origem)) {
            throw new Error("A conta de origem não pode ser destino!");
        }

        if (new Set(contasDestino).size !== contasDestino.length) {
            throw new Error("Existem contas repetidas na lista de destinos!");
        }

        const valorTotal = valor * destinos.length;

        if (origem.saldo < valorTotal) {
            throw new Error("Saldo insuficiente para realizar a ordem!");
        }

        // Primeiro valida tudo, depois realiza as transferências.
        origem.saldo -= valorTotal;

        for (const destino of destinos) {
            destino.saldo += valor;
        }
    }

    // =========================
    // TOTALIZAÇÕES
    // =========================

    quantidadeContas(): number {
        return this.contas.length;
    }

    totalDinheiro(): number {
        return this.contas.reduce(
            (total, conta) => total + conta.saldo, 0
        );
    }

    mediaSaldo(): number {
        const quantidade = this.quantidadeContas();

        if (quantidade === 0) {
            return 0;
        }

        return this.totalDinheiro() / quantidade;
    }

    // =========================
    // MÉTODOS DE CLIENTE
    // =========================

    inserirCliente(cliente: Cliente): void {
        const duplicado = this.clientes.some(c =>
            c.id === cliente.id || c.cpf === cliente.cpf
        );

        if (duplicado) {
            throw new Error("Cliente já cadastrado!");
        }

        this.clientes.push(cliente);
    }

    consultarCliente(cpf: string): Cliente {
        const cliente = this.clientes.find(c => c.cpf === cpf);

        if (!cliente) {
            throw new Error("Cliente não encontrado!");
        }

        return cliente;
    }

    associarContaCliente(
        numeroConta: string,
        cpfCliente: string
    ): void {
        const conta = this.consultar(numeroConta);
        const cliente = this.consultarCliente(cpfCliente);

        if (conta.cliente !== null) {
            throw new Error("Conta já possui titular!");
        }

        if (cliente.contas.includes(conta)) {
            throw new Error("Conta já associada a este cliente!");
        }

        conta.cliente = cliente;
        cliente.contas.push(conta);
    }

    // Mudar o titular de uma conta
    mudarTitularidade(
        numeroConta: string,
        novoCpf: string
    ): void {
        const conta = this.consultar(numeroConta);
        const novoCliente = this.consultarCliente(novoCpf);

        if (conta.cliente === novoCliente) {
            throw new Error("Este cliente já é o titular da conta!");
        }

        // Remove a conta do antigo titular.
        if (conta.cliente !== null) {
            conta.cliente.contas =
                conta.cliente.contas.filter(c => c !== conta);
        }

        // Associa ao novo titular.
        conta.cliente = novoCliente;
        novoCliente.contas.push(conta);
    }

    // Excluir cliente: suas contas ficam sem titular.
    excluirCliente(cpf: string): void {
        const cliente = this.consultarCliente(cpf);

        for (const conta of cliente.contas) {
            conta.cliente = null;
        }

        cliente.contas = [];

        this.clientes = this.clientes.filter(c => c !== cliente);
    }

    // Listar contas sem titular.
    listarContasSemCliente(): Conta[] {
        return this.contas.filter(c => c.cliente === null);
    }

    // Atribuir titular a uma conta sem cliente.
    atribuirTitularidade(
        numeroConta: string,
        cpfCliente: string
    ): void {
        this.associarContaCliente(numeroConta, cpfCliente);
    }

    // Listar contas de um cliente.
    listarContasCliente(cpf: string): Conta[] {
        const cliente = this.consultarCliente(cpf);
        return [...cliente.contas];
    }

    totalizarSaldoCliente(cpf: string): number {
        const contas = this.listarContasCliente(cpf);

        return contas.reduce(
            (total, conta) => total + conta.saldo, 0
        );
    }

    // =========================
    // CARGA INICIAL
    // =========================

    carregarDados(): void {
        const c1 = new Cliente(
            1, "João", "11111111111", new Date("2008-05-10")
        );

        const c2 = new Cliente(
            2, "Maria", "22222222222", new Date("2007-08-15")
        );

        const c3 = new Cliente(
            3, "Pedro", "33333333333", new Date("2006-03-20")
        );

        const c4 = new Cliente(
            4, "Ana", "44444444444", new Date("2008-11-12")
        );

        const c5 = new Cliente(
            5, "Carlos", "55555555555", new Date("2007-01-05")
        );

        this.inserirCliente(c1);
        this.inserirCliente(c2);
        this.inserirCliente(c3);
        this.inserirCliente(c4);
        this.inserirCliente(c5);

        const conta1 = new Conta("1001", 1000);
        const conta2 = new Conta("1002", 2000);
        const conta3 = new Conta("1003", 1500);
        const conta4 = new Conta("1004", 500);
        const conta5 = new Conta("1005", 3000);

        this.inserir(conta1);
        this.inserir(conta2);
        this.inserir(conta3);
        this.inserir(conta4);
        this.inserir(conta5);

        this.associarContaCliente("1001", "11111111111");
        this.associarContaCliente("1002", "11111111111");
        this.associarContaCliente("1003", "22222222222");
        this.associarContaCliente("1004", "33333333333");

        // A conta 1005 fica sem titular.
    }
}
